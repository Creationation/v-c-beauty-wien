export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string | null
          artist_id: string
          artist_name: string
          client_email: string | null
          client_name: string
          client_phone: string | null
          confirmation_sent: boolean | null
          created_at: string
          id: string
          notes: string | null
          notify_24h: boolean | null
          notify_2h: boolean | null
          reminder_24h_sent: boolean | null
          reminder_2h_sent: boolean | null
          service: string
          service_price: string | null
          status: string
        }
        Insert: {
          appointment_date?: string
          appointment_time?: string | null
          artist_id?: string
          artist_name?: string
          client_email?: string | null
          client_name?: string
          client_phone?: string | null
          confirmation_sent?: boolean | null
          created_at?: string
          id?: string
          notes?: string | null
          notify_24h?: boolean | null
          notify_2h?: boolean | null
          reminder_24h_sent?: boolean | null
          reminder_2h_sent?: boolean | null
          service?: string
          service_price?: string | null
          status?: string
        }
        Update: {
          appointment_date?: string
          appointment_time?: string | null
          artist_id?: string
          artist_name?: string
          client_email?: string | null
          client_name?: string
          client_phone?: string | null
          confirmation_sent?: boolean | null
          created_at?: string
          id?: string
          notes?: string | null
          notify_24h?: boolean | null
          notify_2h?: boolean | null
          reminder_24h_sent?: boolean | null
          reminder_2h_sent?: boolean | null
          service?: string
          service_price?: string | null
          status?: string
        }
        Relationships: []
      }
      artist_vacations: {
        Row: {
          artist_id: string
          created_at: string
          id: string
          reason: string | null
          vacation_date: string
        }
        Insert: {
          artist_id: string
          created_at?: string
          id?: string
          reason?: string | null
          vacation_date: string
        }
        Update: {
          artist_id?: string
          created_at?: string
          id?: string
          reason?: string | null
          vacation_date?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          artist_id: string
          booking_date: string | null
          booking_time: string | null
          created_at: string
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          id: string
          notes: string | null
          services: Json
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          artist_id: string
          booking_date?: string | null
          booking_time?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          notes?: string | null
          services?: Json
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          artist_id?: string
          booking_date?: string | null
          booking_time?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          notes?: string | null
          services?: Json
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notification_settings: {
        Row: {
          artist_cindy_email: string | null
          artist_victoria_email: string | null
          email_24h_enabled: boolean | null
          email_2h_enabled: boolean | null
          email_confirmation_enabled: boolean | null
          id: number
          resend_api_key: string | null
          studio_email: string | null
        }
        Insert: {
          artist_cindy_email?: string | null
          artist_victoria_email?: string | null
          email_24h_enabled?: boolean | null
          email_2h_enabled?: boolean | null
          email_confirmation_enabled?: boolean | null
          id?: number
          resend_api_key?: string | null
          studio_email?: string | null
        }
        Update: {
          artist_cindy_email?: string | null
          artist_victoria_email?: string | null
          email_24h_enabled?: boolean | null
          email_2h_enabled?: boolean | null
          email_confirmation_enabled?: boolean | null
          id?: number
          resend_api_key?: string | null
          studio_email?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
