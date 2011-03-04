Gold::Application.routes.draw do
  devise_for :users, :skip => [:registrations, :confirmations] do
    #registrations
    post '/users', :to => 'devise/registrations#create', :as => 'user_registration'

    #confirmations
    get '/users/confirmation', :to => 'devise/confirmations#show', :as => 'user_confirmation'
  end

  resources :reviews, :only => :create

  root :to => 'home#index'
end
