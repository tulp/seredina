Gold::Application.routes.draw do
  devise_for :users, :skip => [:sessions, :registrations, :confirmations] do
    #sessions
    post '/users/sign_in',  :to => 'devise/sessions#create',  :as => 'user_session'
    get  '/users/sign_out', :to => 'devise/sessions#destroy', :as => 'destroy_user_session'

    #registrations
    post '/users', :to => 'devise/registrations#create', :as => 'user_registration'

    #confirmations
    get '/users/confirmation', :to => 'devise/confirmations#show', :as => 'user_confirmation'
  end

  resources :reviews, :only => :create

  resources :gifts, :only => :create

  scope '/j' do
    get 'markets', :to => 'json#markets', :as => 'json_markets'
    get 'users',   :to => 'json#users',   :as => 'json_users'
  end

  # Временно
  match '/gm' => 'home#gm'

  root :to => 'home#index'
end
