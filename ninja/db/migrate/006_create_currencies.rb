class CreateCurrencies < ActiveRecord::Migration
  def change
    create_table :currencies do |t|
      t.string   :name                    # 货币名称
      t.string   :symbol                  # 货币符号
      t.timestamps
    end

    add_index :currencies, :symbol, :unique => true
  end
end
