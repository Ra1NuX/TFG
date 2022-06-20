import Card from "../components/Card";

export default function verifyEmail() {
    return <Card>
        You should Verify your Email, we send you the verification Link to your Email. <button onClick={() => location.reload()} className="text-blue-mid font-semibold italic">Continuar</button>
    </Card>
}