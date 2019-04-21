from sqlalchemy import Column, Integer, String,SMALLINT

from app.models.Base import Base


class City(Base):
    id = Column(Integer, primary_key=True)
    name = Column(String(30))
    pid = Column(Integer)
    deep = Column(SMALLINT)
    pinyin_prefix = Column(String(100))
    pinyin = Column(String(120))
    ext_id = Column(String(50))
    ext_name = Column(String(100))
