Gold::Application.routes.draw do
  devise_for :users, :skip => [:sessions, :registrations] do
    # sessions
    get  '/landing', :to => 'devise/sessions#new',    :as => 'new_user_session'
    post '/landing', :to => 'devise/sessions#create', :as => 'user_session'

    # registrations
    get '/users/:discount_code', :to => 'devise/registrations#edit',   :as => 'edit_user_registration'
    put '/users/:discount_code', :to => 'devise/registrations#update'
  end

  resources :reviews, :only => :create

  resources :gifts, :only => :create

  match '/collector' => 'collector#create', :as => 'collector', :via => :post

  scope '/j' do
    get 'markets/(:id)', :to => 'json#markets',    :as => 'json_markets'
    get 'categories',    :to => 'json#categories', :as => 'json_categories'
    get 'current_user',  :to => 'json#current',    :as => 'json_current_user'
    get 'landing',       :to => 'json#landing',    :as => 'json_landing'
  end

  root :to => 'home#index'
end
