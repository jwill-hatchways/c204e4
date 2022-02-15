class Api::ProspectsFilesController < ApplicationController
  def import
  end

  def progress
    job = ImportJob.find(params.require(:id))

    p job

    if job.user_id != @user.id
      return render status: 403, json: {message: "The import job does not belong to this user."}
    end

    return render status: 200, json: {total: job.total, done: job.done}
  end
end
