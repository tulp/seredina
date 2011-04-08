desc "Send maillist"
task :maillist => :environment do
  User.all.each { |user| UserMailer.maillist(user).deliver }
end