"""empty message

Revision ID: 7871961f26f2
Revises: cd994170e0d2
Create Date: 2016-07-18 16:41:19.374231

"""

# revision identifiers, used by Alembic.
revision = '7871961f26f2'
down_revision = 'cd994170e0d2'

from alembic import op
import sqlalchemy as sa
import sqlalchemy_utils


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.add_column('role_invite', sa.Column('declined', sa.Boolean(), nullable=True))
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('role_invite', 'declined')
    ### end Alembic commands ###
