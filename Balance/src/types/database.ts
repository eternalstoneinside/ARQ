export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: { avatar_url: string | null; created_at: string; display_name: string; id: string; updated_at: string }
        Insert: { avatar_url?: string | null; created_at?: string; display_name?: string; id: string; updated_at?: string }
        Update: { avatar_url?: string | null; display_name?: string; updated_at?: string }
        Relationships: []
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
    }
    Views: { [_ in never]: never }
    Functions: {
      create_space_invite: { Args: { p_space_id: string }; Returns: string }
      create_space_with_invite: { Args: { p_name: string }; Returns: { invite_code: string; space_id: string; space_name: string }[] }
      join_space_by_code: { Args: { p_code: string }; Returns: string }
    }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}
