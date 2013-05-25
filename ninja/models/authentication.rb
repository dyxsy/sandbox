# encoding: utf-8
class Authentication < Authlogic::Session::Base
  authenticate_with User
end
