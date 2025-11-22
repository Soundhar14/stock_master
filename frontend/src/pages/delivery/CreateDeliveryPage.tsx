import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/masterPage.components/PageHeader'
import ButtonSm from '../../components/common/Buttons'
import { authHandler } from '../../utils/authHandler'
import { appRoutes } from '../../routes/appRoutes'
import CreateDeliveryForm from './CreateDeliveryForm'

const CreateDeliveryPage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const token = authHandler()
    if (!token) navigate(appRoutes.signIn)
  }, [navigate])

  const handleNavigateToList = () => navigate(appRoutes.delivery)

  return (
    <main className="flex h-min w-full max-w-full flex-col gap-4">
      <section className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm">
        <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <PageHeader title="Create Delivery" isBack={false} />
          <ButtonSm
            state="outline"
            text="Back to Deliveries"
            onClick={handleNavigateToList}
            className="w-full justify-center md:w-auto"
          />
        </header>
        <p className="text-sm text-slate-600">
          Provide delivery details, assign responsibility, and list the items to
          schedule a new delivery order.
        </p>
        <CreateDeliveryForm
          onCancel={handleNavigateToList}
          onSuccess={handleNavigateToList}
        />
      </section>
    </main>
  )
}

export default CreateDeliveryPage
