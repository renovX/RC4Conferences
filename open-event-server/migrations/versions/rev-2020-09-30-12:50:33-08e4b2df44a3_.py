"""empty message

Revision ID: 08e4b2df44a3
Revises: 8e86e0ddc9a4
Create Date: 2020-09-30 12:50:33.433044

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '08e4b2df44a3'
down_revision = '8e86e0ddc9a4'


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('event_invoices', 'identifier',
               existing_type=sa.VARCHAR(),
               nullable=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('event_invoices', 'identifier',
               existing_type=sa.VARCHAR(),
               nullable=True)
    # ### end Alembic commands ###
