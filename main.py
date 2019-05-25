#!/usr/bin/env python3
"""
Created by ranml on 2019/1/28
"""
import logging

from app import create_app

__author__ = 'ranml'

# 创建 app ，定义在 app/__init__.py
app = create_app()

# 配置文件中的 debug，定义在 config/app.py
debug = app.config['DEBUG']

# print(debug)
if __name__ == "__main__":
    handler = logging.FileHandler('flask.log')
    handler.setLevel(logging.DEBUG)
    logging_format = logging.Formatter(
        '%(asctime)s - %(levelname)s - %(filename)s - %(funcName)s - %(lineno)s - %(message)s')
    handler.setFormatter(logging_format)
    app.logger.addHandler(handler)
    app.run(debug=debug, host='0.0.0.0', port=8200)
