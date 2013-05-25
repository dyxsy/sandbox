class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      # required by authlogic
      t.string            :login                           # 登录帐号
      t.string            :crypted_password     
      t.string            :password_salt        
      t.string            :persistence_token    
      t.integer           :login_count,          :default => 0
      t.datetime          :last_request_at
      t.datetime          :last_login_at
      t.datetime          :current_login_at
      t.string            :last_login_ip
      t.string            :current_login_ip
      # end required

      t.integer           :role_id
      t.string            :name                            # 帐号姓名
      t.timestamps
    end
  end
end
