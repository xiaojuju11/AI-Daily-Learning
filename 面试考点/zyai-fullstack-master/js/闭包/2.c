char* myname = '男模'
void showName () {
  printf("%s \n", myname)
  if (0) {
    char* myname = '黄鹤'
  }
}
int main() {
  showName()
  return 0
}