const Notification = ({ isSucess }) => {
  return (
    <section className={`transition ${isSucess ? '-translate-x-5' : 'translate-x-full'} absolute right-0 bottom-5 w-[250px] h-min rounded-xl bg-slate-400 p-4`}>
      <p className='font-semibold text-sm'>
        Se ha enviado la información exitosamente.
      </p>
    </section>
  )
}

export default Notification
