require 'rubygems'
require 'rake'

SDK_PATH = "/opt/PalmSDK/Current/bin"

task :install do
  sh "#{SDK_PATH}/palm-package src"
  sh "#{SDK_PATH}/palm-install com.wtfware.tedoff_1.0.0_all.ipk"
end

task :log do
  sh "#{SDK_PATH}/palm-log com.wtfware.tedoff"
end
