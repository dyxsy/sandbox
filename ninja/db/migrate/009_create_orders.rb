class CreateOrders < ActiveRecord::Migration
  def change
    create_table :orders do |t|                                    # 报单(委托)
      t.integer     :investor_id
      t.integer     :account_id                                    # 帐户ID
      t.date        :trading_day                                   # 交易日
      t.integer     :instrument_id                                 # 合约ID
      t.string      :instrument_code                               # 合约编码
      
      t.integer     :ex_user_id                                    # 执行者
      t.integer     :volume                                        # 手数
      t.integer     :direction                                     # 买卖方向     多头=>1 空头=>0  
      t.integer     :offset                                        # 开/平        开=>1   平=>2
      t.integer     :status                                        # 状态
      t.string      :local_no                                      # 本地单号
      t.decimal     :order_time,     :precision => 18, :scale => 0 # 委托时间
      t.decimal     :price,          :precision => 16, :scale => 6 # 报价

      t.timestamps
    end

    add_index :orders, :account_id
    add_index :orders, :instrument_id
  end
end
