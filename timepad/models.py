from pony.orm import Database, Required, Set, Optional

db = Database()

class User(db.Entity):
    name = Required(str)
    projects = Set('Project')
    frames = Set('Frame')
    clients = Set('Client')
    tags = Set('Tag')
    password = Required(str)

class Frame(db.Entity):
    start = Required(int)
    stop = Required(int)
    project = Required('Project')
    user = Required(User)
    tags = Set('Tag')

class Project(db.Entity):
    name = Required(str)
    frames = Set(Frame)
    client = Required('Client')
    user = Required(User)

class Client(db.Entity):
    name = Required(str)
    projects = Set(Project)
    user = Required(User)
    color = Optional(str)

class Tag(db.Entity):
    name = Required(str)
    frames = Set(Frame)
    user = Required(User)
