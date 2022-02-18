require "test_helper"

class Api::ProspectsFilesControllerTest < ActionDispatch::IntegrationTest
  test "should get import" do
    get api_prospects_files_import_url
    assert_response :success
  end

  test "should get progress" do
    get api_prospects_files_progress_url
    assert_response :success
  end
end
