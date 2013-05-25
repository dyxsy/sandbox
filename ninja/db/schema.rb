# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 29) do

  create_table "accounts", :force => true do |t|
    t.integer  "investor_id"
    t.integer  "currency_id"
    t.integer  "master_account_id"
    t.decimal  "current_init_capital", :precision => 16, :scale => 6
    t.decimal  "total",                :precision => 16, :scale => 6
    t.decimal  "available",            :precision => 16, :scale => 6
    t.decimal  "margin",               :precision => 16, :scale => 6
    t.decimal  "risk_degree",          :precision => 16, :scale => 6
    t.decimal  "position_profit",      :precision => 16, :scale => 6
    t.decimal  "close_profit",         :precision => 16, :scale => 6
    t.decimal  "profit",               :precision => 16, :scale => 6
    t.decimal  "commission",           :precision => 16, :scale => 6
    t.datetime "created_at",                                          :null => false
    t.datetime "updated_at",                                          :null => false
  end

  add_index "accounts", ["investor_id", "currency_id"], :name => "index_accounts_on_investor_id_and_currency_id", :unique => true
  add_index "accounts", ["investor_id"], :name => "index_accounts_on_investor_id"
  add_index "accounts", ["master_account_id"], :name => "index_accounts_on_master_account_id"

  create_table "admins", :force => true do |t|
    t.string   "name"
    t.string   "login"
    t.integer  "out_id"
    t.integer  "role_id"
    t.string   "comment"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "cfmmc_trades", :force => true do |t|
    t.string   "instrument_code"
    t.integer  "direction"
    t.integer  "vorh"
    t.integer  "offset"
    t.decimal  "cost",            :precision => 16, :scale => 6
    t.integer  "volume"
    t.decimal  "amount",          :precision => 16, :scale => 6
    t.decimal  "commission",      :precision => 16, :scale => 6
    t.decimal  "close_profit",    :precision => 16, :scale => 6
    t.datetime "created_at",                                     :null => false
    t.datetime "updated_at",                                     :null => false
  end

  create_table "commission_rate_items", :force => true do |t|
    t.integer  "commission_rate_id"
    t.integer  "instrument_id"
    t.string   "instrument_code"
    t.string   "offset"
    t.integer  "direction"
    t.integer  "category"
    t.decimal  "fixed",              :precision => 16, :scale => 6
    t.decimal  "perc",               :precision => 16, :scale => 6
    t.datetime "created_at",                                        :null => false
    t.datetime "updated_at",                                        :null => false
  end

  add_index "commission_rate_items", ["commission_rate_id"], :name => "index_commission_rate_items_on_commission_rate_id"
  add_index "commission_rate_items", ["direction"], :name => "index_commission_rate_items_on_direction"
  add_index "commission_rate_items", ["instrument_code"], :name => "index_commission_rate_items_on_instrument_code"
  add_index "commission_rate_items", ["instrument_id"], :name => "index_commission_rate_items_on_instrument_id"
  add_index "commission_rate_items", ["offset"], :name => "index_commission_rate_items_on_offset"

  create_table "commission_rates", :force => true do |t|
    t.integer  "investor_id"
    t.boolean  "auto_merged"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  add_index "commission_rates", ["investor_id"], :name => "index_commission_rates_on_investor_id"

  create_table "currencies", :force => true do |t|
    t.string   "name"
    t.string   "symbol"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "currencies", ["symbol"], :name => "index_currencies_on_symbol", :unique => true

  create_table "delayed_jobs", :force => true do |t|
    t.integer  "priority",   :default => 0
    t.integer  "attempts",   :default => 0
    t.text     "handler"
    t.text     "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string   "locked_by"
    t.string   "queue"
    t.datetime "created_at",                :null => false
    t.datetime "updated_at",                :null => false
  end

  add_index "delayed_jobs", ["priority", "run_at"], :name => "delayed_jobs_priority"

  create_table "finance_withs", :force => true do |t|
    t.string   "customer"
    t.string   "login"
    t.string   "mode"
    t.decimal  "quota",                :precision => 16, :scale => 6
    t.decimal  "margin",               :precision => 16, :scale => 6
    t.decimal  "current_receivable",   :precision => 16, :scale => 6
    t.decimal  "current_paid",         :precision => 16, :scale => 6
    t.decimal  "current_init_capital", :precision => 16, :scale => 6
    t.integer  "status",                                              :default => 0
    t.string   "comment"
    t.datetime "created_at",                                                         :null => false
    t.datetime "updated_at",                                                         :null => false
  end

  create_table "groups", :force => true do |t|
    t.integer  "admin_id"
    t.string   "name"
    t.string   "notification_nums"
    t.string   "service_num"
    t.integer  "member_count",      :default => 0
    t.integer  "out_id"
    t.datetime "created_at",                       :null => false
    t.datetime "updated_at",                       :null => false
  end

  add_index "groups", ["name"], :name => "index_groups_on_name"
  add_index "groups", ["out_id"], :name => "index_groups_on_out_id"

  create_table "instrument_ctrls", :force => true do |t|
    t.integer  "instrument_id"
    t.string   "instrument_code"
    t.integer  "investor_id"
    t.integer  "forbid"
    t.datetime "created_at",      :null => false
    t.datetime "updated_at",      :null => false
  end

  add_index "instrument_ctrls", ["instrument_id"], :name => "index_instrument_ctrls_on_instrument_id"
  add_index "instrument_ctrls", ["investor_id"], :name => "index_instrument_ctrls_on_investor_id"

  create_table "instruments", :force => true do |t|
    t.string   "exchange_name"
    t.string   "code"
    t.string   "variety"
    t.boolean  "subscribed"
    t.decimal  "volume_multiple",        :precision => 16, :scale => 4
    t.decimal  "max_limit_order_volume", :precision => 16, :scale => 4
    t.decimal  "min_limit_order_volume", :precision => 16, :scale => 4
    t.decimal  "price_tick",             :precision => 16, :scale => 4
    t.boolean  "is_trading"
    t.datetime "created_at",                                            :null => false
    t.datetime "updated_at",                                            :null => false
  end

  add_index "instruments", ["code"], :name => "index_instruments_on_code"

  create_table "interested_group_members", :force => true do |t|
    t.integer  "interested_group_id"
    t.integer  "investor_id"
    t.datetime "created_at",          :null => false
    t.datetime "updated_at",          :null => false
  end

  add_index "interested_group_members", ["interested_group_id"], :name => "index_interested_group_members_on_interested_group_id"
  add_index "interested_group_members", ["investor_id"], :name => "index_interested_group_members_on_investor_id"

  create_table "interested_groups", :force => true do |t|
    t.integer  "user_id"
    t.string   "name"
    t.integer  "member_count", :default => 0
    t.integer  "out_id"
    t.datetime "created_at",                  :null => false
    t.datetime "updated_at",                  :null => false
  end

  add_index "interested_groups", ["member_count"], :name => "index_interested_groups_on_member_count"
  add_index "interested_groups", ["out_id"], :name => "index_interested_groups_on_out_id"
  add_index "interested_groups", ["user_id"], :name => "index_interested_groups_on_user_id"

  create_table "investors", :force => true do |t|
    t.string   "name"
    t.string   "login"
    t.string   "id_no"
    t.integer  "out_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "investors", ["login"], :name => "index_investors_on_login"
  add_index "investors", ["out_id"], :name => "index_investors_on_out_id"

  create_table "margin_rate_items", :force => true do |t|
    t.integer  "margin_rate_id"
    t.integer  "instrument_id"
    t.string   "instrument_code"
    t.integer  "direction"
    t.decimal  "value",           :precision => 16, :scale => 6
    t.datetime "created_at",                                     :null => false
    t.datetime "updated_at",                                     :null => false
  end

  add_index "margin_rate_items", ["direction"], :name => "index_margin_rate_items_on_direction"
  add_index "margin_rate_items", ["instrument_code"], :name => "index_margin_rate_items_on_instrument_code"
  add_index "margin_rate_items", ["instrument_id"], :name => "index_margin_rate_items_on_instrument_id"
  add_index "margin_rate_items", ["margin_rate_id"], :name => "index_margin_rate_items_on_margin_rate_id"

  create_table "margin_rates", :force => true do |t|
    t.integer  "investor_id"
    t.boolean  "auto_merged"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  add_index "margin_rates", ["investor_id"], :name => "index_margin_rates_on_investor_id"

  create_table "memberships", :force => true do |t|
    t.integer  "investor_id"
    t.integer  "group_id"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  add_index "memberships", ["investor_id", "group_id"], :name => "index_memberships_on_investor_id_and_group_id", :unique => true

  create_table "menus", :force => true do |t|
    t.string   "parent_id"
    t.string   "name"
    t.string   "label"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "menus", ["parent_id"], :name => "index_menus_on_parent_id"

  create_table "menus_roles", :id => false, :force => true do |t|
    t.integer "menu_id"
    t.integer "role_id"
  end

  add_index "menus_roles", ["menu_id"], :name => "index_menus_roles_on_menu_id"
  add_index "menus_roles", ["role_id"], :name => "index_menus_roles_on_role_id"

  create_table "orders", :force => true do |t|
    t.integer  "investor_id"
    t.integer  "account_id"
    t.date     "trading_day"
    t.integer  "instrument_id"
    t.string   "instrument_code"
    t.integer  "ex_user_id"
    t.integer  "volume"
    t.integer  "direction"
    t.integer  "offset"
    t.integer  "status"
    t.string   "local_no"
    t.decimal  "order_time",      :precision => 18, :scale => 0
    t.decimal  "price",           :precision => 16, :scale => 6
    t.datetime "created_at",                                     :null => false
    t.datetime "updated_at",                                     :null => false
  end

  add_index "orders", ["account_id"], :name => "index_orders_on_account_id"
  add_index "orders", ["instrument_id"], :name => "index_orders_on_instrument_id"

  create_table "payments", :force => true do |t|
    t.string   "customer"
    t.string   "sign"
    t.string   "order_num"
    t.integer  "bank_bill_num"
    t.integer  "transaction_num"
    t.decimal  "total",           :precision => 16, :scale => 6
    t.integer  "status",                                         :default => 0
    t.string   "goods"
    t.string   "comment"
    t.string   "ip_address"
    t.datetime "created_at",                                                    :null => false
    t.datetime "updated_at",                                                    :null => false
  end

  add_index "payments", ["created_at"], :name => "index_payments_on_created_at"
  add_index "payments", ["customer"], :name => "index_payments_on_customer"
  add_index "payments", ["order_num"], :name => "index_payments_on_order_num"

  create_table "positions", :force => true do |t|
    t.integer  "investor_id"
    t.integer  "account_id"
    t.integer  "instrument_id"
    t.string   "instrument_code"
    t.integer  "direction"
    t.integer  "vorh"
    t.integer  "volume"
    t.integer  "pos_type"
    t.decimal  "available",       :precision => 16, :scale => 6
    t.decimal  "cost",            :precision => 16, :scale => 6
    t.decimal  "last_price",      :precision => 16, :scale => 6
    t.decimal  "commission",      :precision => 16, :scale => 6
    t.decimal  "profit",          :precision => 16, :scale => 6
    t.decimal  "profit_ratio",    :precision => 16, :scale => 6
    t.datetime "created_at",                                     :null => false
    t.datetime "updated_at",                                     :null => false
  end

  add_index "positions", ["account_id"], :name => "index_positions_on_account_id"
  add_index "positions", ["instrument_id"], :name => "index_positions_on_instrument_id"
  add_index "positions", ["investor_id"], :name => "index_positions_on_investor_id"

  create_table "power_bits", :force => true do |t|
    t.string   "group"
    t.string   "action"
    t.string   "text"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "roles", :force => true do |t|
    t.string   "name"
    t.string   "label"
    t.string   "description"
    t.decimal  "permission",  :precision => 50, :scale => 0
    t.boolean  "built_in"
    t.datetime "created_at",                                 :null => false
    t.datetime "updated_at",                                 :null => false
  end

  add_index "roles", ["name"], :name => "index_roles_on_name", :unique => true

  create_table "simple_captcha_data", :force => true do |t|
    t.string   "key",        :limit => 40
    t.string   "value",      :limit => 6
    t.datetime "created_at",               :null => false
    t.datetime "updated_at",               :null => false
  end

  create_table "trades", :force => true do |t|
    t.integer  "investor_id"
    t.integer  "account_id"
    t.date     "trading_day"
    t.string   "trade_no"
    t.integer  "instrument_id"
    t.string   "instrument_code"
    t.integer  "direction"
    t.integer  "vorh"
    t.integer  "offset"
    t.integer  "volume"
    t.integer  "pos_type"
    t.decimal  "cost",            :precision => 16, :scale => 6
    t.decimal  "amount",          :precision => 16, :scale => 6
    t.decimal  "trade_time",      :precision => 18, :scale => 0
    t.decimal  "close_profit",    :precision => 16, :scale => 6
    t.decimal  "commission",      :precision => 16, :scale => 6
    t.datetime "created_at",                                     :null => false
    t.datetime "updated_at",                                     :null => false
  end

  add_index "trades", ["account_id", "trading_day", "trade_no", "instrument_id"], :name => "domain_pk1", :unique => true
  add_index "trades", ["account_id"], :name => "index_trades_on_account_id"
  add_index "trades", ["investor_id"], :name => "index_trades_on_investor_id"

  create_table "users", :force => true do |t|
    t.string   "login"
    t.string   "crypted_password"
    t.string   "password_salt"
    t.string   "persistence_token"
    t.integer  "login_count",       :default => 0
    t.datetime "last_request_at"
    t.datetime "last_login_at"
    t.datetime "current_login_at"
    t.string   "last_login_ip"
    t.string   "current_login_ip"
    t.integer  "role_id"
    t.string   "name"
    t.datetime "created_at",                       :null => false
    t.datetime "updated_at",                       :null => false
  end

  create_table "withdrawals", :force => true do |t|
    t.string   "login"
    t.string   "bank"
    t.string   "bank_account"
    t.string   "comment"
    t.integer  "status"
    t.string   "objective"
    t.datetime "created_at",   :null => false
    t.datetime "updated_at",   :null => false
  end

end
