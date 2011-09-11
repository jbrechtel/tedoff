require 'rubygems'
require 'rake'

SDK_PATH = "/opt/PalmSDK/Current/bin"

desc "Install the app"
task :install do
  sh "#{SDK_PATH}/palm-package src"
  sh "#{SDK_PATH}/palm-install com.wtfware.tedoff_1.0.0_all.ipk"
end

desc "Show log"
task :log do
  sh "#{SDK_PATH}/palm-log -f com.wtfware.tedoff"
end
