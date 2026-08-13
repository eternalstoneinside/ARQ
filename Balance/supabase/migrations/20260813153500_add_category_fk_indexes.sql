create index space_categories_created_by_idx
  on public.space_categories(created_by);

create index transactions_category_reference_idx
  on public.transactions(space_id, category_id, type);
