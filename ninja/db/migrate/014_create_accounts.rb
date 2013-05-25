class CreateAccounts < ActiveRecord::Migration
  def change
    create_table :accounts do |t|
      t.integer        :investor_id                                         # 投资者ID
      t.integer        :currency_id                                         # 货币ID
      t.integer        :master_account_id                                   # 上级帐户Id
      t.decimal        :current_init_capital, :precision => 16, :scale => 6 # 当日初始资金
      t.decimal        :total,                :precision => 16, :scale => 6 # 总资金
      t.decimal        :available,            :precision => 16, :scale => 6 # 可用资金
      t.decimal        :margin,               :precision => 16, :scale => 6 # 保证金
      t.decimal        :risk_degree,          :precision => 16, :scale => 6 # 风险度
      t.decimal        :position_profit,      :precision => 16, :scale => 6 # 持仓盈亏
      t.decimal        :close_profit,         :precision => 16, :scale => 6 # 平仓盈亏
      t.decimal        :profit,               :precision => 16, :scale => 6 # 总盈亏
      t.decimal        :commission,           :precision => 16, :scale => 6 # 手续费
      t.timestamps
    end

    add_index :accounts, [:investor_id, :currency_id], :unique => true
    add_index :accounts, :investor_id
    add_index :accounts, :master_account_id
  end
end
