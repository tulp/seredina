set :domain, "seredina.sitedock.ru"
set :rails_env, "staging"
role :app, domain
role :web, domain
role :db,  domain, :primary => true
set :deploy_to, "/home/tulp/#{application}"
set :user, "tulp"
set :branch, 'master'