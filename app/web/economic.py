"""
Created by 简单7月 on 2019/1/28
"""
from datetime import datetime

import xlrd
from flask import jsonify, request
from sqlalchemy import text
from xlrd import xldate_as_tuple

from app.models.Base import db
from app.models.Data import EconomicData, Economic

__author__ = '简单7月'

# from flask import render_template

from . import web


@web.route('/economic', methods=['get'])
def lists():
    """
    获取一个列表
    :return:
    """
    form = request.args.to_dict()
    if form.__contains__('city') and form['city'] != '':
        sql = "SELECT ed.date, ed.total_data,ed.is_quarter FROM economic_data ed " \
              "JOIN economic e ON e.id = ed.economic_id " \
              "WHERE city=:city"
        if form.__contains__('type') != -1:
            sql += " AND e.type=:type"
        if form.__contains__('sub_type') != -1:
            sql += " AND e.sub_type=:sub_type"
        if form.__contains__('date'):
            date = form['date'] + '%'
            sql += ' AND date LIKE "' + date + '"'

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
        return jsonify([])


@web.route('/economic/excel', methods=['POST'])
def upload_excel():
    """
    上传 excel 文件并保存到数据库
    :return:
    """
    file = request.files['file']
    try:
        r = file.read()
        book = xlrd.open_workbook(file_contents=r)
        names = book.sheet_names()
        ret = []
        for sheet in names:
            sh = book.sheet_by_name(sheet)
            print(sh.row_values(0))
            print(sh.row_values(1))
            res = insert_data_in_db(sh, sheet)
            ret.append(res)
        return jsonify({'code': 200, 'msg': '数据导入成功', 'data': ret})
    except:
        print("open excel file failed!")
        return jsonify({'code': 400, 'msg': '数据导入失败'})
    # sheets = book.sheet_names()


def insert_data_in_db(sh, sheet):
    row_nums = sh.nrows
    list = []
    for i in range(1, row_nums):
        row_data = sh.row_values(i)
        if sheet == "economic":
            value = {'id': int(row_data[0]), 'type': int(row_data[1]), 'name': row_data[2], 'sub_type': int(row_data[3]),
                     'sub_name': row_data[4], 'city': row_data[5], 'created_at': getDateStr(row_data[6]),
                     'updated_at': getDateStr(row_data[7]), 'status': int(row_data[8])}
            list.append(value)
        elif sheet == 'economic_data':
            value = {'id': int(row_data[0]), 'total_data': row_data[1], 'date': row_data[2], 'is_quarter': int(row_data[3]),
                     'economic_id': int(row_data[4]), 'status': int(row_data[5]), 'updated_at': getDateStr(row_data[6]),
                     'created_at': getDateStr(row_data[7])}
            list.append(value)
    if sheet == "economic":
        db.session.execute(Economic.__table__.insert(), list)
    elif sheet == "economic_data":
        db.session.execute(EconomicData.__table__.insert(), list)
    db.session.commit()
    list.clear()
    return {'name': sheet, 'num_rows': row_nums}


def getDateStr(date):
    """
    格式化日期时间
    :param date:
    :return:
    """
    date = datetime(*xldate_as_tuple(date, 0))
    cell = date.strftime('%Y/%m/%d %H:%M:%S')
    return cell

