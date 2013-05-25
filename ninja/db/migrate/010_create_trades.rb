class CreateTrades < ActiveRecord::Migration
  def change
    create_table :trades do |t|                                    # 成交记录
      t.integer  :investor_id                                      # 投资者ID
      t.integer  :account_id                                       # 帐户ID
      t.date     :trading_day                                      # 交易日

      t.string   :trade_no                                         # 成交序号 
      t.integer  :instrument_id                                    # 合约表id    
      t.string   :instrument_code                                  # 合约编号
      t.integer  :direction                                        # 买卖方向     多头=>1 空头=>0
      t.integer  :vorh                                             # 投机/套保    投机=>1 套保=>3    
      t.integer  :offset                                           # 开/平        开=>1   平=>2
      t.integer  :volume                                           # 手数
      t.integer  :pos_type                                         # 1: 昨仓 2: 今仓
      t.decimal  :cost,             :precision => 16, :scale => 6  # 成交价
      t.decimal  :amount,           :precision => 16, :scale => 6  # 成交额
      t.decimal  :trade_time,       :precision => 18, :scale => 0  # 交易时间(精确到微妙)
      t.decimal  :close_profit,     :precision => 16, :scale => 6  # 平仓盈亏
      t.decimal  :commission,       :precision => 16, :scale => 6  # 手续费

      t.timestamps
    end

    add_index   :trades,   [:account_id, :trading_day, :trade_no, :instrument_id],  :unique => true, :name => 'domain_pk1'
    add_index   :trades,   :investor_id
    add_index   :trades,   :account_id
    
  end
end
