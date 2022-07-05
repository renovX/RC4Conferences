"""empty message

Revision ID: 3a14893d21f0
Revises: 09c177e36ac2
Create Date: 2021-09-22 22:38:58.396678

"""

from alembic import op
import sqlalchemy as sa
import sqlalchemy_utils


# revision identifiers, used by Alembic.
revision = '3a14893d21f0'
down_revision = '09c177e36ac2'


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('events', sa.Column('can_pay_by_invoice', sa.Boolean(), server_default='False', nullable=False))
    op.add_column('events', sa.Column('invoice_details', sa.String(), nullable=True))
    op.add_column('events_version', sa.Column('can_pay_by_invoice', sa.Boolean(), server_default='False', autoincrement=False, nullable=True))
    op.add_column('events_version', sa.Column('invoice_details', sa.String(), autoincrement=False, nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('events_version', 'invoice_details')
    op.drop_column('events_version', 'can_pay_by_invoice')
    op.drop_column('events', 'invoice_details')
    op.drop_column('events', 'can_pay_by_invoice')
    # ### end Alembic commands ###
