class CreateCfmmcTrades < ActiveRecord::Migration
  def change
    create_table :cfmmc_trades do |t|
      
      t.string   :instrument_code                                  # 合约编码
      t.integer  :direction                                        # 买卖方向     多头(买)=>1 空头(卖)=>0
      t.integer  :vorh                                             # 投机/套保    投机=>1 套保=>3    
      t.integer  :offset                                           # 开/平        开=>1   平=>2
      t.decimal  :cost,             :precision => 16, :scale => 6  # 成交价
      t.integer  :volume                                           # 手数
      t.decimal  :amount,           :precision => 16, :scale => 6  # 成交额 
      t.decimal  :commission,       :precision => 16, :scale => 6  # 手续费
      t.decimal  :close_profit,     :precision => 16, :scale => 6  # 平仓盈亏
      t.timestamps
    end
  end
end
