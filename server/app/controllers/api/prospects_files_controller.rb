require 'csv'

class Api::ProspectsFilesController < ApplicationController
  def import
    if !request.headers['Content-Type'].include? 'multipart/form-data'
      return(
        render status: 412,
               json: {
                 message:
                   "The Content-Type header must be 'multipart/form-data'"
               }
      )
    end

    if !params[:email_index]
      return(
        render status: 400,
               json: {
                 message: "'email_index' parameter must be defined."
               }
      )
    end

    csv = CSV.read(params[:file])
    total = csv.length

    if total > 1_000_000
      return(
        render status: 413,
               json: {
                 message:
                   'The imported file must contain fewer than 1 million rows.'
               }
      )
    end

    if params[:has_headers]
      csv.delete_at(0)
      total -= 1
    end

    toUpload = []
    email_index = params[:email_index].to_i
    fname_index =
      params[:first_name_index] ? params[:first_name_index].to_i : nil
    lname_index = params[:last_name_index] ? params[:last_name_index].to_i : nil
    overwrite = params[:force] || false
    has_headers = params[:has_headers] || false

    csv.each do |item|
      prospect = {}
      prospect[:email] = item[email_index]
      prospect[:user_id] = @user.id
      prospect[:first_name] = fname_index ? item[fname_index] : nil
      prospect[:last_name] = lname_index ? item[lname_index] : nil
      prospect[:created_at] = Time.now
      prospect[:updated_at] = Time.now
      toUpload << prospect
    end

    if overwrite
      result = Prospect.upsert_all(toUpload, unique_by: %i[user_id email])
    else
      result = Prospect.insert_all(toUpload)
    end

    render json:
             ImportJob.create(
               {
                 total: csv.length,
                 done: result.length,
                 filename: '',
                 first_name_index: fname_index,
                 last_name_index: lname_index,
                 email_index: email_index,
                 force_overwrite: overwrite,
                 has_headers: has_headers,
                 job_status: 'Complete',
                 user_id: @user.id
               }
             )
  end

  def progress
    job = ImportJob.find(params.require(:id))

    if job.user_id != @user.id
      return(
        render status: 403,
               json: {
                 message: 'The import job does not belong to this user.'
               }
      )
    end

    render status: 200, json: { total: job.total, done: job.done }
  end
end
