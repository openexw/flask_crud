from sqlalchemy import Column, Integer,String,VARCHAR

from app.models.Base import Base

class Data(Base):
    id = Column(Integer(11), primary_key=True)
    data_name = Column(VARCHAR(24), nullable=False)
    data_unit = Column(VARCHAR(10),nullable=False)
