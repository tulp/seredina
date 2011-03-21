Gold::Application.routes.draw do
  devise_for :users, :skip => [:sessions] do
    get  '/landing', :to => 'devise/sessions#new',    :as => 'new_user_session'
    post '/landing', :to => 'devise/sessions#create', :as => 'user_session'
  end

  resources :reviews, :only => :create

  resources :gifts, :only => :create

  resources :users, :only => [:show, :update]

  scope '/j' do
    get 'markets',      :to => 'json#markets',    :as => 'json_markets'
    get 'categories',   :to => 'json#categories', :as => 'json_categories'
    get 'current_user', :to => 'json#current',    :as => 'json_current_user'
    get 'landing',      :to => 'json#landing',    :as => 'json_landing'
  end



  # Временно
  match '/gm' => 'home#gm'

  root :to => 'home#index'
end
