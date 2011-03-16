Gold::Application.routes.draw do
  devise_for :users, :skip => [:sessions, :registrations] do
    #sessions
    post '/users/sign_in',  :to => 'devise/sessions#create',  :as => 'user_session'
    get  '/users/sign_out', :to => 'devise/sessions#destroy', :as => 'destroy_user_session' # временно

    #registrations
    post '/users', :to => 'devise/registrations#create', :as => 'user_registration'
  end

  resources :reviews, :only => :create

  resources :gifts, :only => :create

  scope '/j' do
    get 'markets',      :to => 'json#markets',    :as => 'json_markets'
    get 'users',        :to => 'json#users',      :as => 'json_users'
    get 'categories',   :to => 'json#categories', :as => 'json_categories'
    get 'current_user', :to => 'json#current',    :as => 'json_current_user'
  end

  # Временно
  match '/gm' => 'home#gm'

  root :to => 'home#index'
end
