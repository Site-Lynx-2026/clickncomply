/**
 * Hand-written Supabase types matching schema in supabase/migrations/0001_init.sql.
 * Regenerate from live DB later via `supabase gen types typescript`.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "incomplete"
  | "incomplete_expired"
  | "unpaid"
  | "paused";

export type SubscriptionTier = "free" | "pro";
export type OrgMemberRole = "owner" | "admin" | "member";
export type RecordType =
  | "internal_audit"
  | "ncr"
  | "capa"
  | "training"
  | "management_review"
  | "risk"
  | "customer_feedback"
  | "supplier_eval"
  | "document_review"
  | "incident"
  | "objective";
export type RecordStatus = "open" | "in_progress" | "closed" | "overdue";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          onboarded_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          onboarded_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          onboarded_at?: string | null;
        };
        Relationships: [];
      };
      organisations: {
        Row: {
          id: string;
          name: string;
          slug: string | null;
          logo_url: string | null;
          industry: string | null;
          employee_band: string | null;
          description: string | null;
          country_code: string;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug?: string | null;
          logo_url?: string | null;
          industry?: string | null;
          employee_band?: string | null;
          description?: string | null;
          country_code?: string;
          created_by: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string | null;
          logo_url?: string | null;
          industry?: string | null;
          employee_band?: string | null;
          description?: string | null;
          country_code?: string;
          created_by?: string;
        };
        Relationships: [];
      };
      organisation_members: {
        Row: {
          id: string;
          organisation_id: string;
          user_id: string;
          role: OrgMemberRole;
          joined_at: string;
        };
        Insert: {
          id?: string;
          organisation_id: string;
          user_id: string;
          role?: OrgMemberRole;
        };
        Update: {
          id?: string;
          organisation_id?: string;
          user_id?: string;
          role?: OrgMemberRole;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          id: string;
          organisation_id: string;
          tier: SubscriptionTier;
          status: SubscriptionStatus;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          stripe_price_id: string | null;
          current_period_start: string | null;
          current_period_end: string | null;
          trial_ends_at: string | null;
          cancel_at_period_end: boolean;
          cancelled_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organisation_id: string;
          tier?: SubscriptionTier;
          status?: SubscriptionStatus;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          stripe_price_id?: string | null;
          current_period_start?: string | null;
          current_period_end?: string | null;
          trial_ends_at?: string | null;
          cancel_at_period_end?: boolean;
          cancelled_at?: string | null;
        };
        Update: {
          id?: string;
          organisation_id?: string;
          tier?: SubscriptionTier;
          status?: SubscriptionStatus;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          stripe_price_id?: string | null;
          current_period_start?: string | null;
          current_period_end?: string | null;
          trial_ends_at?: string | null;
          cancel_at_period_end?: boolean;
          cancelled_at?: string | null;
        };
        Relationships: [];
      };
      framework_activations: {
        Row: {
          id: string;
          organisation_id: string;
          framework_slug: string;
          activated_at: string;
        };
        Insert: {
          id?: string;
          organisation_id: string;
          framework_slug: string;
        };
        Update: {
          id?: string;
          organisation_id?: string;
          framework_slug?: string;
        };
        Relationships: [];
      };
      questionnaire_responses: {
        Row: {
          id: string;
          organisation_id: string;
          framework_slug: string;
          responses: Json;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organisation_id: string;
          framework_slug: string;
          responses?: Json;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          organisation_id?: string;
          framework_slug?: string;
          responses?: Json;
          completed_at?: string | null;
        };
        Relationships: [];
      };
      rams_documents: {
        Row: {
          id: string;
          organisation_id: string;
          builder_slug: string;
          title: string | null;
          status: "draft" | "complete" | "archived";
          form_data: Json;
          pdf_storage_path: string | null;
          is_watermarked: boolean;
          generated_at: string | null;
          created_by: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organisation_id: string;
          builder_slug: string;
          title?: string | null;
          status?: "draft" | "complete" | "archived";
          form_data?: Json;
          pdf_storage_path?: string | null;
          is_watermarked?: boolean;
          generated_at?: string | null;
          created_by?: string | null;
          updated_by?: string | null;
        };
        Update: {
          id?: string;
          organisation_id?: string;
          builder_slug?: string;
          title?: string | null;
          status?: "draft" | "complete" | "archived";
          form_data?: Json;
          pdf_storage_path?: string | null;
          is_watermarked?: boolean;
          generated_at?: string | null;
          created_by?: string | null;
          updated_by?: string | null;
        };
        Relationships: [];
      };
      generated_documents: {
        Row: {
          id: string;
          organisation_id: string;
          framework_slug: string;
          template_slug: string;
          title: string;
          body: string | null;
          version: number;
          pdf_storage_path: string | null;
          is_watermarked: boolean;
          generated_at: string;
          generated_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          organisation_id: string;
          framework_slug: string;
          template_slug: string;
          title: string;
          body?: string | null;
          version?: number;
          pdf_storage_path?: string | null;
          is_watermarked?: boolean;
          generated_by?: string | null;
        };
        Update: {
          id?: string;
          organisation_id?: string;
          framework_slug?: string;
          template_slug?: string;
          title?: string;
          body?: string | null;
          version?: number;
          pdf_storage_path?: string | null;
          is_watermarked?: boolean;
          generated_by?: string | null;
        };
        Relationships: [];
      };
      audit_records: {
        Row: {
          id: string;
          organisation_id: string;
          framework_slug: string | null;
          record_type: RecordType;
          title: string;
          description: string | null;
          status: RecordStatus;
          data: Json;
          due_date: string | null;
          closed_at: string | null;
          created_by: string | null;
          assigned_to: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organisation_id: string;
          framework_slug?: string | null;
          record_type: RecordType;
          title: string;
          description?: string | null;
          status?: RecordStatus;
          data?: Json;
          due_date?: string | null;
          closed_at?: string | null;
          created_by?: string | null;
          assigned_to?: string | null;
        };
        Update: {
          id?: string;
          organisation_id?: string;
          framework_slug?: string | null;
          record_type?: RecordType;
          title?: string;
          description?: string | null;
          status?: RecordStatus;
          data?: Json;
          due_date?: string | null;
          closed_at?: string | null;
          created_by?: string | null;
          assigned_to?: string | null;
        };
        Relationships: [];
      };
      reminders: {
        Row: {
          id: string;
          organisation_id: string;
          framework_slug: string | null;
          reminder_type: string;
          title: string;
          body: string | null;
          scheduled_for: string;
          sent_at: string | null;
          dismissed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          organisation_id: string;
          framework_slug?: string | null;
          reminder_type: string;
          title: string;
          body?: string | null;
          scheduled_for: string;
        };
        Update: {
          id?: string;
          organisation_id?: string;
          framework_slug?: string | null;
          reminder_type?: string;
          title?: string;
          body?: string | null;
          scheduled_for?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_org_member: {
        Args: { _org_id: string; _user_id: string };
        Returns: boolean;
      };
      get_org_tier: {
        Args: { _org_id: string };
        Returns: SubscriptionTier;
      };
    };
    Enums: {
      subscription_status: SubscriptionStatus;
      subscription_tier: SubscriptionTier;
      org_member_role: OrgMemberRole;
      record_type: RecordType;
      record_status: RecordStatus;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
