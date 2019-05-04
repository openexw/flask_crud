"""
Created by 简单7月 on 2019-05-03
"""

from flask import Flask as _Flask
from flask.json import JSONEncoder as _JSONEncoder

__author__ = '七月'


class JSONEncoder(_JSONEncoder):
    def default(self, o):
        # if hasattr(o, 'keys') and hasattr(o, '__getitem__'):
        #     return dict(o)
        # if isinstance(o, date):
        #     return o.strftime('%Y-%m-%d')
        pass


class Flask(_Flask):
    json_encoder = JSONEncoder

