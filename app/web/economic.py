"""
Created by 简单7月 on 2019/1/28
"""
from json import dumps

from flask import jsonify, request
from sqlalchemy import and_, text

from app.models.Base import db
from app.models.Data import Economic, EconomicData
from app.validate.economic import EconomicValidate

__author__ = '简单7月'

# from flask import render_template

from . import web


@web.route('/economic/test',)
def test():
    pass


@web.route('/economic', methods=['get'])
def lists():
    """
    获取一个列表
    :return:
    """
    form = request.args.to_dict()
    if form.__contains__('city') and form.__contains__('type') and form.__contains__('sub_type'):
        sql = "SELECT ed.date, ed.total_data,ed.is_quarter FROM economic_data ed " \
              "JOIN economic e ON e.id = ed.economic_id " \
              "WHERE e.type=:type AND e.sub_type=:sub_type and city=:city"
        if form.__contains__('date'):
            date = form['date'] + '%'
            sql += ' AND date LIKE "'+date+'"'

        # 如果 type = 1 or type = 4 则表示为季度数据
        if int(form['type']) == 1 or int(form['type']) == 4:
            sql += " AND is_quarter=1 GROUP BY `ed`.`total_data`,ed.date"

        sql += ' order by date asc'
        # 执行 SQL 语句
        res = db.session.execute(text(sql),
                                 {'type': form['type'],
                                  'sub_type': form['sub_type'], 'city': form['city']})
        all_data = res.fetchall()
        return jsonify(all_data)
    else:
        return jsonify({'data': [], 'code': 404, 'msg': '参数错误'})

# @web.route('/cates', methods=['get'])
# def cates():
    # o = db.session.execute('select `name` from `economic` order by `type` asc group by `name`');
    # data = o.fetchall()
    # for d in data:
