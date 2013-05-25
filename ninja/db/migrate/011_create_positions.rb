class CreatePositions < ActiveRecord::Migration
  def change
    create_table :positions do |t|  # 持仓
      t.integer  :investor_id                                 # 投资者ID
      t.integer  :account_id                                  # 帐户ID
      t.integer  :instrument_id                               # 合约ID
      t.string   :instrument_code                             # 合约编码
      
      t.integer  :direction                                   # 买卖方向     多头=>1 空头=>0
      t.integer  :vorh                                        # 投机/套保    投机=>1 套保=>3    
      t.integer  :volume                                      # 手数
      t.integer  :pos_type                                    # 1: 昨仓 2: 今仓
      t.decimal  :available,    :precision => 16, :scale => 6 # 可用
      t.decimal  :cost,         :precision => 16, :scale => 6 # 成本
      t.decimal  :last_price,   :precision => 16, :scale => 6 # 最新价
      t.decimal  :commission,   :precision => 16, :scale => 6 # 手续费
      t.decimal  :profit,       :precision => 16, :scale => 6 # 盈亏金额
      t.decimal  :profit_ratio, :precision => 16, :scale => 6 # 盈亏比例
      t.timestamps
    end

    add_index :positions, :investor_id
    add_index :positions, :account_id
    add_index :positions, :instrument_id
  end
end
