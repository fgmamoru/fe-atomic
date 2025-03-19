import { PageLayout } from "@/components/Layout/PageLayout";
import { ATOMIC_DEX_CONTRACT_ADDRESS } from "@/services/config.service";

export default function AdminPage() {
    return (
        <PageLayout>
            <h1>Admin</h1>
            <p><b>DEX:</b> {ATOMIC_DEX_CONTRACT_ADDRESS}</p>
        </PageLayout>
    );
}