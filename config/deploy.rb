require 'bundler/capistrano'

set :application, "seredina"
set :repository,  "git@github.com:Jazzcloud/seredina.git"
set :domain, "seredina.sitedock.ru"

set :scm, :git
# Or: `accurev`, `bzr`, `cvs`, `darcs`, `git`, `mercurial`, `perforce`, `subversion` or `none`

role :app, domain
role :web, domain
role :db,  domain, :primary => true
set :deploy_to, "/home/tulp/#{application}"

set :rails_env, "production"
set :user, "tulp"
set :use_sudo, false
set :branch, 'master'

set :run_method, :run

namespace :deploy do

  task :default do
    update
    migrate
    restart
  end

  task :after_update, :roles => :app do
    link_db_config
  end

  desc "Restart Application"
  task :restart, :roles => :app do
    run "touch #{current_release}/tmp/restart.txt"
  end

  desc "Restart Application without any callbacks"
  task :fast_restart, :roles => :app do
    run "touch #{current_release}/tmp/restart.txt"
  end

  desc "Create database.yml symlink"
  task :link_db_config, :roles => :app do
    run "ln -fs #{shared_path}/database.yml #{current_release}/config/database.yml"
  end

  # Run rake task. ex: cap production deploy:rake TASK="tulp:after_load"
  task :rake, :roles => [:app] do
    run "cd #{current_path} && rake #{ENV['TASK']} RAILS_ENV=#{rails_env}"
  end

end