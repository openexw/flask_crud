"""
Created by 简单7月 on 2019/1/28
"""

from flask import jsonify

from app.models.Base import db
from app.models.Data import Economic, EconomicData

__author__ = '简单7月'

# from flask import render_template

from . import web


class July:
    name = 'July'
    age = 12


@web.route('/economic/test')
def test():
    july = July()
    print(july.name)
    return jsonify(July())
    # print('1212')


@web.route('/economic', methods=['get'])
def lists():
    """
    获取一个列表
    :return:
    """

    
    # economics = Economic.query.all()
    # result = []
    # for economic in economics:
    #     result.append(economic.to_json())
    # return jsonify(result), 200

    # economics = Economic.query().filter(Economic.data.any(EconomicData.economic_id==Economic.id)).all()
    # economics = Economic.query().filter(Economic.data.any(EconomicData.economic_id==Economic.id)).all()
    # economics = Economic.query.all()
    #
    # print(economics)
    #
    # return jsonify(economics)
    # result = []
    # for economic in economics:
    #     result.append(economic.to_json())
    # return jsonify(result), 200
    # return jsonify(economic)


@web.route('/economic', methods=['post'])
def store():
    """
    新增
    :return:
    """

    # economic = Economic(type=1, name='地区生产总值', sub_type=1, sub_name='第一产业', city='成都')
    economic_data = EconomicData(data=55.00, time='2014/1/1', is_quarter=1, economic_id=1)
    db.session.add_all(economic_data)

    db.commit()
    return "ass"

    # return data


@web.route('/economic/<int:id>', methods=['get'])
def show(id):
    """
    获取一条数据
    :return:
    """

    return id


@web.route('/economic/<int:id>', methods=['put'])
def update(id):
    """
    新增
    :param id: id
    :return:
    """
    return id


@web.route('/economic/<int:id>', methods=['delete'])
def destroy(id):
    """
    删除
    :return:
    """
    return id


