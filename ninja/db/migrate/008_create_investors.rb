class CreateInvestors < ActiveRecord::Migration
  def change
    create_table :investors do |t|  # 投资者
      t.string        :name         # 姓名
      t.string        :login        # 用户名
      t.string        :id_no        # 身份证号码
      t.integer       :out_id       # 外部id, 用于数据搬迁

      t.timestamps
    end

    add_index   :investors,   :login
    add_index   :investors,   :out_id
  end
end
