class CreateFinanceWiths < ActiveRecord::Migration
  def change
    create_table :finance_withs do |t|
      t.string   :customer                                                # 配资人
      t.integer  :investor_id                                             # 投资者ID
      t.string   :login                                                   # 帐号
      t.string   :mode                                                    # 收费方式
      t.decimal  :quota,                :precision => 16, :scale => 6     # 配额
      t.decimal  :margin,               :precision => 16, :scale => 6     # 风险保证金
      t.decimal  :current_receivable,   :precision => 16, :scale => 6     # 当日应收
      t.decimal  :current_paid,         :precision => 16, :scale => 6     # 当日实收
      t.decimal  :current_init_capital, :precision => 16, :scale => 6     # 当日初始资金 
      t.integer  :status,               :default => 0                     # 状态 0:未出账, 1:已出账
      t.string   :comment                                                 # 备注
      t.timestamps
    end
  end
end