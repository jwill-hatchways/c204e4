user = User.create!(email: "test@test.com", password: "sample")
import_job = user.import_jobs.create!(
    total: 100,
    done: 95,
    filename: "testfile.csv",
    email_index: 1,
    first_name_index: 2,
    last_name_index: 3,
    force_overwrite: false,
    has_headers: true,
    job_status: "Complete"
)

for i in 1..3 do
    campaign = user.campaigns.create!(name: "Awesome Campaign #{i}")
    for j in 1..100 do
        prospect = user.prospects.create!(
            email: "target#{j}@example.com",
            first_name: "Name#{j}",
            last_name: "Mc#{j}"
        )
        campaign.prospects << prospect
    end
end