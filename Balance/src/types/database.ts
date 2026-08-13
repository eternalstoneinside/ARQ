export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: { active_space_id: string | null; avatar_url: string | null; created_at: string; display_name: string; id: string; updated_at: string }
        Insert: { active_space_id?: string | null; avatar_url?: string | null; created_at?: string; display_name?: string; id: string; updated_at?: string }
        Update: { active_space_id?: string | null; avatar_url?: string | null; display_name?: string; updated_at?: string }
        Relationships: [{ foreignKeyName: 'profiles_active_space_id_fkey'; columns: ['active_space_id']; isOneToOne: false; referencedRelation: 'spaces'; referencedColumns: ['id'] }]
      }
      spaces: {
        Row: { created_at: string; created_by: string; id: string; name: string; updated_at: string }
        Insert: { created_at?: string; created_by: string; id?: string; name: string; updated_at?: string }
        Update: { name?: string; updated_at?: string }
        Relationships: []
      }
      space_members: {
        Row: { joined_at: string; role: string; space_id: string; user_id: string }
        Insert: { joined_at?: string; role?: string; space_id: string; user_id: string }
        Update: { role?: string }
        Relationships: [{ foreignKeyName: 'space_members_space_id_fkey'; columns: ['space_id']; isOneToOne: false; referencedRelation: 'spaces'; referencedColumns: ['id'] }]
      }
      space_invites: {
        Row: { code_hash: string; created_at: string; created_by: string; expires_at: string; id: string; max_uses: number; revoked_at: string | null; space_id: string; used_count: number }
        Insert: { code_hash: string; created_by: string; expires_at?: string; id?: string; max_uses?: number; space_id: string; used_count?: number }
        Update: { expires_at?: string; revoked_at?: string | null; used_count?: number }
        Relationships: [{ foreignKeyName: 'space_invites_space_id_fkey'; columns: ['space_id']; isOneToOne: false; referencedRelation: 'spaces'; referencedColumns: ['id'] }]
      }
      space_categories: {
        Row: { archived_at: string | null; created_at: string; created_by: string; icon: string; id: string; is_default: boolean; name: string; sort_order: number; space_id: string; type: string; updated_at: string }
        Insert: { archived_at?: string | null; created_at?: string; created_by: string; icon?: string; id?: string; is_default?: boolean; name: string; sort_order?: number; space_id: string; type: string; updated_at?: string }
        Update: { archived_at?: string | null; icon?: string; name?: string; sort_order?: number; updated_at?: string }
        Relationships: [{ foreignKeyName: 'space_categories_space_id_fkey'; columns: ['space_id']; isOneToOne: false; referencedRelation: 'spaces'; referencedColumns: ['id'] }]
      }
      transactions: {
        Row: { amount_minor: number; category_id: string; comment: string | null; created_at: string; created_by: string; currency: string; deleted_at: string | null; deleted_by: string | null; id: string; person_id: string; person_name: string; space_id: string; transaction_date: string; type: string; updated_at: string }
        Insert: { amount_minor: number; category_id: string; comment?: string | null; created_at?: string; created_by: string; currency?: string; deleted_at?: string | null; deleted_by?: string | null; id?: string; person_id: string; person_name: string; space_id: string; transaction_date?: string; type: string; updated_at?: string }
        Update: { amount_minor?: number; category_id?: string; comment?: string | null; created_at?: string; created_by?: string; currency?: string; deleted_at?: string | null; deleted_by?: string | null; id?: string; person_id?: string; person_name?: string; space_id?: string; transaction_date?: string; type?: string; updated_at?: string }
        Relationships: [{ foreignKeyName: 'transactions_space_id_fkey'; columns: ['space_id']; isOneToOne: false; referencedRelation: 'spaces'; referencedColumns: ['id'] }]
      }
    }
    Views: { [_ in never]: never }
    Functions: {
      create_space_invite: { Args: { p_space_id: string }; Returns: string }
      create_space_with_invite: { Args: { p_name: string }; Returns: { invite_code: string; space_id: string; space_name: string }[] }
      delete_transaction: { Args: { p_transaction_id: string }; Returns: undefined }
      join_space_by_code: { Args: { p_code: string }; Returns: string }
      leave_space: { Args: { p_space_id: string }; Returns: undefined }
      remove_space_member: { Args: { p_member_id: string; p_space_id: string }; Returns: undefined }
      revoke_space_invites: { Args: { p_space_id: string }; Returns: undefined }
      transfer_space_ownership: { Args: { p_new_owner_id: string; p_space_id: string }; Returns: undefined }
    }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}
