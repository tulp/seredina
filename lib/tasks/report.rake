namespace :report do
  desc 'Requests for discount reception'
  task :discounts, [:weeks_ago] => :environment do |t, args|
    args.with_defaults(:weeks_ago => 0)
    weeks_ago = args[:weeks_ago].to_i

    interval   = 1.week
    today      = Date.today
    start_date = today - weeks_ago.next.weeks
    end_date   = start_date + interval

    users = User.where('discount_confirmed_at >= ?', start_date).where('discount_confirmed_at < ?', end_date).order(:discount_confirmed_at, :id)
    if users.any?
      puts 'Дата       |ID   |Email                     |Имя             |Телефон'
      puts '-' * 73
      users.each do |user|
        id    = user.id.to_s.ljust(4)
        email = user.email.ljust(25)
        name  = user.name.ljust(15)
        puts "#{user.discount_confirmed_at} |#{id} |#{email} |#{name} |#{user.phone}"
      end
    else
      puts 'Заявок нет'
    end
  end
end