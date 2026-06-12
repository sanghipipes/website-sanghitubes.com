// Supabase database types — keep in sync with migrations.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type QuoteStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'
export type AdminRole   = 'admin' | 'sales' | 'editor'

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id:          string
          name:        string
          slug:        string
          category:    string
          description: string | null
          material:    string | null
          size:        string | null
          image_url:   string | null
          featured:    boolean
          created_at:  string
        }
        Insert: {
          id?:          string
          name:         string
          slug:         string
          category:     string
          description?: string | null
          material?:    string | null
          size?:        string | null
          image_url?:   string | null
          featured?:    boolean
          created_at?:  string
        }
        Update: {
          id?:          string
          name?:        string
          slug?:        string
          category?:    string
          description?: string | null
          material?:    string | null
          size?:        string | null
          image_url?:   string | null
          featured?:    boolean
          created_at?:  string
        }
        Relationships: []
      }

      quote_requests: {
        Row: {
          id:            string
          customer_name: string
          company_name:  string | null
          email:         string
          phone:         string
          city:          string | null
          message:       string | null
          status:        QuoteStatus
          created_at:    string
        }
        Insert: {
          id?:             string
          customer_name:   string
          company_name?:   string | null
          email:           string
          phone:           string
          city?:           string | null
          message?:        string | null
          status?:         QuoteStatus
          created_at?:     string
        }
        Update: {
          id?:            string
          customer_name?: string
          company_name?:  string | null
          email?:         string
          phone?:         string
          city?:          string | null
          message?:       string | null
          status?:        QuoteStatus
          created_at?:    string
        }
        Relationships: []
      }

      quote_items: {
        Row: {
          id:               string
          quote_request_id: string
          product_id:       string | null
          product_name:     string
          quantity:         number
        }
        Insert: {
          id?:               string
          quote_request_id:  string
          product_id?:       string | null
          product_name:      string
          quantity:          number
        }
        Update: {
          id?:               string
          quote_request_id?: string
          product_id?:       string | null
          product_name?:     string
          quantity?:         number
        }
        Relationships: [
          {
            foreignKeyName: 'quote_items_quote_request_id_fkey'
            columns: ['quote_request_id']
            isOneToOne: false
            referencedRelation: 'quote_requests'
            referencedColumns: ['id']
          }
        ]
      }

      contact_messages: {
        Row: {
          id:         string
          name:       string
          email:      string
          subject:    string | null
          message:    string
          created_at: string
        }
        Insert: {
          id?:        string
          name:       string
          email:      string
          subject?:   string | null
          message:    string
          created_at?: string
        }
        Update: {
          id?:      string
          name?:    string
          email?:   string
          subject?: string | null
          message?: string
          created_at?: string
        }
        Relationships: []
      }

      admin_users: {
        Row: {
          id:         string
          email:      string
          role:       AdminRole
          created_at: string
        }
        Insert: {
          id:          string
          email:       string
          role?:       AdminRole
          created_at?: string
        }
        Update: {
          id?:         string
          email?:      string
          role?:       AdminRole
          created_at?: string
        }
        Relationships: []
      }
    }

    Views: { [_: string]: never }
    Functions: { [_: string]: never }
    Enums: { [_: string]: never }
    CompositeTypes: { [_: string]: never }
  }
}

// Row-type aliases
export type ProductRow        = Database['public']['Tables']['products']['Row']
export type QuoteRequestRow   = Database['public']['Tables']['quote_requests']['Row']
export type QuoteItemRow      = Database['public']['Tables']['quote_items']['Row']
export type ContactMessageRow = Database['public']['Tables']['contact_messages']['Row']
export type AdminUserRow      = Database['public']['Tables']['admin_users']['Row']
