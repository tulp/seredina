Gold::Application.routes.draw do
  resources :users, :only => :create do
    member do
      get :confirm
    end
  end

  root :to => 'home#index'
end
