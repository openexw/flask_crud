"""
Created by 简单7月 on 2019-05-03
"""
__author = "简单7月"

class July:
    name = 'July'
    age = 12

    def keys(self):
        # return ('name')
        # return ('name', 'age')
        return ['name', 'age']

    def __getitem__(self, item):
        return  getattr(self, item)

o = July()
# print(o['name'])
# print(o['age'])

print(dict(o))