"""
Created by 简单7月 on 2019/1/28
"""
from datetime import date

from flask import Flask as _Flask
from flask.json import JSONEncoder as _JSONEncoder
from flask_login import LoginManager

from app.models.Base import db

__author__ = '简单7月'

login_manager = LoginManager()


class JSONEncoder(_JSONEncoder):
    # 重写 Flask 下的 JSONEncoder 下的 default
    def default(self, o):
        """
        # 对象转换字典
        1. __dict__
        2. dict
        """
        if hasattr(o, 'keys') and hasattr(o, '__getitem__'):
            return dict(o)
        if isinstance(o, date):
            return o.strftime('%Y-%m-%d')


class Flask(_Flask):
    # 让 Flask 执行我们自定义的 JSONEncoder
    json_encoder = JSONEncoder


def create_app():
    """
    创建 app
    :return:
    """
    app = Flask(__name__)
    # 加载配置文件，定义在 config 目录下
    app.config.from_object('config.app')
    # 数据库配置
    app.config.from_object('config.database')

    # 注册蓝图
    register_blueprint(app)

    # 数据库初始化
    db.init_app(app)
    with app.app_context():
        # 创建数据表，sqlalchemy 会自己给我创建，记得在 config/database.py 中配置好数据库（这用的是 flask-sqlalchemy，它是 flask 的定制版本）
        db.create_all(app=app)

    # login manager
    login_manager.init_app(app)
    login_manager.login_view = 'web.login'
    login_manager.login_message = '请先登录或者注册'

    return app


def register_blueprint(app):
    """
    注册蓝图
    :param app:
    :return:
    """
    from app.web import web
    app.register_blueprint(web)
