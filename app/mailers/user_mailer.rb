class UserMailer < ActionMailer::Base
  default :from => "from@example.com put into config"

  def confirmation(user)
    @user = user
    mail  :to => @user.email, :subject => 'CHANGE ME and put into locale'
  end
end
