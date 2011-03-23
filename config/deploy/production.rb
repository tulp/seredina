set :default_environment, {
  'PATH' => "/home/tulp/.rvm/gems/ree-1.8.7-2010.02/bin:/home/tulp/.rvm/gems/ree-1.8.7-2010.02@global/bin:/home/tulp/.rvm/rubies/ree-1.8.7-2010.02/bin:/home/tulp/.rvm/bin:/home/tulp/.gem/ruby/1.8/bin/:/usr/local/bin:/usr/bin:/bin:/usr/games",
  'RUBY_VERSION' => 'ruby 1.8.7',
  'GEM_HOME'     => '/home/tulp/.rvm/gems/ree-1.8.7-2010.02',
  'GEM_PATH'     => '/home/tulp/.rvm/gems/ree-1.8.7-2010.02:/home/tulp/.rvm/gems/ree-1.8.7-2010.02@global',
  'BUNDLE_PATH'  => '/home/tulp/.rvm/gems/ree-1.8.7-2010.02'  # If you are using bundler.
}

set :domain, "seredina.tulp.ru"
set :rails_env, "production"