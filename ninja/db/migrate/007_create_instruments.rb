class CreateInstruments < ActiveRecord::Migration
  def change
    create_table :instruments do |t|
      t.string        :exchange_name                                          # 交易所
      t.string        :code                                                   # 合约编码，全部小写
      t.string        :variety                                                # 品种
      t.boolean       :subscribed                                             # 是否已订阅, 0未订阅,1已订阅
      t.decimal       :volume_multiple,        :precision => 16, :scale => 4  # 乘数
      t.decimal       :max_limit_order_volume, :precision => 16, :scale => 4  # 最小报单手数
      t.decimal       :min_limit_order_volume, :precision => 16, :scale => 4  # 最大报单手数
      t.decimal       :price_tick,             :precision => 16, :scale => 4  # 最小变动价位
      t.boolean       :is_trading                                             # 是否可成交, 0不可交易,1可交易
      t.timestamps
    end
    add_index   :instruments,   :code

  end
end
