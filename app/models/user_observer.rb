class UserObserver < ActiveRecord::Observer
  observe :review, :gift

  def after_create(record)
    user = record.user

    if record.is_a? Review
      user.reload # for reviews count
      user.get_gift! if user.reviews.size % 3 == 0
    elsif record.is_a? Gift
      user.give_gift!
      UserMailer.give_gift(record).deliver
    end
  end
end
